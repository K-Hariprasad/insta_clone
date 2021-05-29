import React, { useState, useEffect } from "react";
import "./Posts.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './FirebaseConfig';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function Posts({signedUser, username, imageUrl, caption, postId }) {
  let history = useHistory()
  const [comment, setComment] = useState()
  const [comments, setComments] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(()=>{
    let unsubscribe;
    if(postId){
      unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp','desc').onSnapshot((snapsot)=>{
        setComments(snapsot.docs.map((doc)=>({
          id:doc.id,
          comment:doc.data()
        })))
      })
    }
    return () => unsubscribe();
  },[postId])
  const postComment = (e) => {
    if(signedUser){
      e.preventDefault();
      db.collection('posts').doc(postId).collection('comments').add({
        text : comment,
        username : signedUser.displayName,
        timestamp : firebase.firestore.FieldValue.serverTimestamp()
      })
      setComment('')
    }
    else{
      alert('Please login...')
      history.push('/login')
    }
  }
  const deletePost = (Postid) => {
    var r = window.confirm("Are you sure? Do you want to delete this post?");
    if (r == true) {
      db.collection('posts').doc(postId).delete();
    }
    else{
      handleClose()
    }
  }
  const deleteComment = (id) => {
    var r = window.confirm("Are you sure? Do you want to delete this comment?");
    if (r == true) {
      db.collection('posts').doc(postId).collection('comments').doc(id).delete();
    } 
  }
  return (
    <div className="post_main">
      <div className="post_header">
        <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        <h3 className="text-capitalize">{username}</h3>
        {username === signedUser?.displayName &&
        <IconButton aria-label="delete" onClick={handleClick}>
          <MoreVertIcon/>
        </IconButton>}
      </div>
      <div>
        <img className="post_image" src={imageUrl} alt="post-img" />
      </div>
      <h4 className="post_caption">
        <strong className="text-capitalize">{username}</strong>
        {"  "}
        {caption}
      </h4>
      <div className = "post_comments">
          {comments.map(({id, comment}) => (
            <div key={id} className="post_comment">
              <p>
                <strong className="text-capitalize">{comment.username}</strong>
                {"  "}
                {comment.text}
              </p>
              {comment.username === signedUser?.displayName &&
              <IconButton aria-label="delete" onClick={() => deleteComment(id)}>
                <DeleteIcon />
              </IconButton>}
            </div>
            ))}
      </div>
      <form className="post_commentBox" onSubmit={postComment}>
        <input type="text" placeholder="Add a comment..." value={comment} onChange={(e)=>setComment(e.target.value)}></input>
        <button type="submit" disabled={!comment}>
          <SendIcon/>
        </button>
      </form>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          style={{ padding: "10px 30px", fontSize: "20px" }}
          onClick={deletePost}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Posts;
