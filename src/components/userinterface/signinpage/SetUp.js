import Paper from '@mui/material/Paper';
import { Button, RadioGroup } from '@mui/material';
import { useState } from 'react';
import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../../services/FetchNodeAdminServices';

export default function SetUp(){

    const location = useLocation()
    const [mobileno,setMobileno] = useState(location?.state?.mobileno)
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [gender,setGender] = useState('')
    const [emailAddress,setEmailAddress] = useState('')
    const [dob,setDob] = useState('')
    const [snackBar,setSnackBar] = useState({open:false,message:''})

    var navigate = useNavigate()
    const dispatch = useDispatch()

    // ✅ Gender Toggle
    const handleGenderChange = (value) => {
      if (gender === value) {
        setGender('')
      } else {
        setGender(value)
      }
    }

    // ✅ Email Validation
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    // ✅ DOB Validation (yyyy-mm-dd + valid date + no future)
    const isValidDOB = (date) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

      const selected = new Date(date)
      const today = new Date()

      return selected <= today
    }

    const handleSubmit = async () => {

      // Name validation
      if (!firstName || !lastName) {
        setSnackBar({ message: "Please enter first and last name", open: true })
        return
      }

      // Email validation
      if (emailAddress && !isValidEmail(emailAddress)) {
        setSnackBar({ message: "Invalid email format", open: true })
        return
      }

      // DOB validation
      if (!isValidDOB(dob)) {
        setSnackBar({ message: "DOB must be in yyyy-mm-dd format & valid", open: true })
        return
      }

      var body = {
        mobileno,
        firstname:firstName,
        lastname:lastName,
        emailaddress:emailAddress,
        gender,
        dob
      }

      var response = await postData('userinterface/submit_user_data',body)

      if(response.status){
        body['userid'] = response.userid
        dispatch({type:"ADD_USER",payload:[response?.userid,body]})
        setSnackBar({message:response.message,open:true})
        navigate('/cartdisplaypage')
      }
      else{
        setSnackBar({message:response.message,open:true})
      }
    }

    const handleClose = () => {
      setSnackBar({message:'' ,open:false})
    }

    return(
    <div>
      <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
        
        <Paper elevation={4} style={{width:380,height:600,padding:10,borderRadius:20,display:'flex',flexDirection:'column',margin:'1%'}}>
          
          <div style={{padding:15}}>
            
            <div style={{marginTop:20,fontFamily:'JioType, helvetica, arial, sans-serif',fontWeight:950,fontSize:25}}>
              Setup Your Account
            </div>

            <div style={{fontFamily:'JioType, helvetica, arial, sans-serif',fontWeight:500,fontSize:'1rem',marginTop:10,color:'#535c68'}}>
              Seemless Onboarding,quick checkouts,and faster deliveries across Jiomart,Ajio and other Reliance Retail Platforms.
            </div> 

            {/* First Name */}
            <div>
              <TextField onChange={(e)=>setFirstName(e.target.value)} label="First Name*" variant="standard" fullWidth />
            </div>

            {/* Last Name */}
            <div style={{marginTop:'5%'}}>
              <TextField onChange={(e)=>setLastName(e.target.value)} label="Last Name*" variant="standard" fullWidth />
            </div>

            {/* Gender */}
            <div style={{marginTop:20,fontFamily:'JioType, helvetica, arial, sans-serif',fontWeight:800,fontSize:16}}>
              Gender
            </div>

            <RadioGroup row value={gender}>
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
                onClick={() => handleGenderChange('Female')}
              />
              <FormControlLabel
                value="Male"
                control={<Radio />}
                label="Male"
                onClick={() => handleGenderChange('Male')}
              />
              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
                onClick={() => handleGenderChange('Other')}
              />
            </RadioGroup>

            {/* Email */}
            <div style={{marginTop:'2%'}}>
              <TextField onChange={(e)=>setEmailAddress(e.target.value)} label="E-Mail ID" variant="standard" fullWidth />
            </div>

            {/* DOB (Manual Input) */}
            <div style={{marginTop:'3%'}}>
              <TextField
                type="text"
                value={dob}
                onChange={(e)=>setDob(e.target.value)}
                label="Date Of Birth"
                variant="standard"
                fullWidth
                placeholder="yyyy-mm-dd"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              fullWidth
              style={{
                border:'1px solid #ddd',
                borderRadius:25,
                height:50,
                marginTop:'10%',
                color:'#fff',
                background:'#0078ad',
                fontWeight:700
              }}
            >
              Submit
            </Button>

            <div style={{fontSize:11,marginTop:20,color:'#535c68'}}>
              By Continuing, you agree to our terms and conditions.
            </div>

          </div>
        </Paper>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBar.open}
        onClose={handleClose}
        autoHideDuration={5000}
        message={snackBar.message}
      />
    </div>
    )
}