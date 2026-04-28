import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useState } from 'react';
import React from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { useLocation,useNavigate } from 'react-router-dom';
import { postData } from '../../../services/FetchNodeAdminServices';
import { useDispatch, useSelector } from 'react-redux';

export default function Otp(){

    const [otp,setOtp] = useState('')
    const [loading,setLoading] = useState(false)

    const location = useLocation()
    const mobileno = location?.state?.phonenumber

    const navigate = useNavigate()
    const dispatch = useDispatch()

    var cartData = useSelector((state)=>state.cart)
    var user = useSelector((state)=>state.user)

    // OTP input change
    const handleChange = (newValue) => {
        setOtp(newValue)
    }

    // ✅ VERIFY OTP (backend)
    const handleVerify = async () => {

        if (otp.length < 4) {
            alert("Enter valid OTP")
            return
        }

        setLoading(true)

        const result = await postData('userinterface/verify_otp', {
            mobileno,
            otp
        });

        if (result.status) {

            var response = await postData('userinterface/check_user_mobileno',{mobileno})

            if(response.status){

                dispatch({type:"ADD_USER",payload:[response?.data.userid,response?.data]})

                var res = await postData('userinterface/check_user_address',{userid:response?.data.userid})

                if(res.status){
                    var userDataWithAddress = {...response?.data,...res?.data[0]}
                    dispatch({type:"ADD_USER",payload:[response.data.userid,userDataWithAddress]})
                }

                navigate('/cartdisplaypage')

            } else {
                navigate("/setup",{state:{mobileno}})
            }

        } else {
            alert("Invalid OTP")
        }

        setLoading(false)
    }

    // ✅ RESEND OTP
    const handleResend = async () => {
        await postData('userinterface/send_otp', { mobileno });
        alert("OTP Resent Successfully")
    }

    return(
        <div>
            <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                
                <Paper elevation={4} style={{width:380,height:'auto',padding:10,marginTop:45,borderRadius:20,display:'flex',flexDirection:'column'}}>
                    
                    <div style={{padding:15}}>
                        
                        <div>
                            <img src={'/arrow.png'} style={{width:20,height:20,cursor:'pointer'}}/>    
                        </div>

                        <div style={{marginTop:20,fontWeight:950,fontSize:25}}>
                            OTP verification
                        </div>
                        
                        <div style={{fontSize:'1rem',marginTop:10,color:'#535c68'}}>
                            Enter the OTP sent to you on<br/>
                            <span style={{fontWeight:550}}>+91-{mobileno}</span>
                            <span style={{marginLeft:5,color:'#1B1464',fontWeight:550,cursor:'pointer'}}> Change Number</span>
                        </div> 

                        <div style={{marginTop:35}}>
                            <MuiOtpInput value={otp} length={5} onChange={handleChange} />
                        </div> 

                        <div 
                            onClick={handleResend}
                            style={{cursor:'pointer',marginLeft:'70%',marginTop:'5%',color:'#1B1464',fontWeight:550}}
                        >
                            Resend OTP   
                        </div>

                        <Button
                            fullWidth
                            disabled={loading}
                            style={{
                                border:'1px solid #ddd',
                                borderRadius:25,
                                height:50,
                                marginTop:'25%',
                                color:'#fff',
                                background:'#0078ad',
                                fontWeight:700
                            }}
                            onClick={handleVerify}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </Button>

                        <div style={{fontSize:11,marginTop:20,color:'#535c68',marginBottom:'22%'}}>
                            By Continuing, you agree to our terms and conditions.
                        </div>

                    </div>
                </Paper>
            </div>
        </div>
    )
}