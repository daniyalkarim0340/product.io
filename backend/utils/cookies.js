const CookiesOption={
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:15*60*60*1000
   
}

export default CookiesOption
