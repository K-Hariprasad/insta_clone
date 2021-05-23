import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from "@material-ui/core/Avatar";
import './CreatePost.css'
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import {db, storage} from './FirebaseConfig'
import firebase from 'firebase'
import LinearProgress from '@material-ui/core/LinearProgress';

function CreatePost({showModal,user}) {
    const [previewImg,setPreviewImg] = useState()
    const [progress, setProgress]=useState()
    const [caption, setCaption] = useState()
    const [image, setImage] = useState()

    const handlePost = () =>{
        const uploadTask = storage.ref(`post_images/${image.name}`).put(image)
        uploadTask.on('state_changed', 
            (snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                )
                setProgress(progress)
            }, 
            (error) => {
                alert(error.message)
            },
            () => {
                storage.ref('post_images').child(image.name).getDownloadURL().then(
                    url => {
                        db.collection("posts").add({
                            caption : caption,
                            imageUrl :url,
                            username : user.displayName,
                            timeStamp : firebase.firestore.FieldValue.serverTimestamp()
                        })
                        setProgress(0);
                        setCaption();
                        setImage();
                        setPreviewImg();
                        closeModal()
                    }
                )
            })
    }
    const closeModal =() => {
           showModal(false)

    }
    const handleChange=(event)=> {
       setImage(event.target.files[0])
       setPreviewImg(URL.createObjectURL(event.target.files[0]))
       
    }
    const inputFileRef = useRef( null );
   
    const onBtnClick = () => {
        inputFileRef.current.click();
    }

  return (
    <div>
      <Dialog
        open={true}
        onClose={()=>showModal(false)}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
            <div style={{display:'flex',alignItems:'center',marginBottom:'10px',gap:'10px'}}>
                <Avatar
                    alt={user && user.displayName}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{user && user.displayName}</h3>
            </div>
            <input
                style={{display:'none'}}
                type="file"
                ref={inputFileRef}
                onChange={handleChange}
            />
            
            <div className="craetePost_previw">
               { previewImg && <img  src={previewImg} alt="preview"/>} 
            </div>
            <div className={previewImg?"uploadBtnRight":"uploadBtnCenter"}>
                <IconButton onClick={onBtnClick} color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                </IconButton>
            </div>
           
          <TextField
            autoFocus
            margin="dense"
            id="post_desc"
            label="What's on your mind?"
            type="text"
            fullWidth
            multiline
            onChange={(e)=>setCaption(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
            {progress?
            <LinearProgress variant="determinate" value={progress} />:
            <div>
                <Button onClick={()=>showModal(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={handlePost} color="primary">
                    Post
                </Button>
            </div>}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreatePost;


