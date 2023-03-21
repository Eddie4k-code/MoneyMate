const { useNavigate } = require("react-router-dom");

/*  
 
 This is for error handling axios api requests, so that if there is an error recieved from the middleware, then we can go ahead and 
 remove the accessToken if there is one (it would be expired if there is) and navigate them back to the login page!
 
 */


export const ErrorHandler = (err) => {
    const navigate = useNavigate();

    if (err.response && err.response.data.msg == "Token is not valid" || "Not Authenticated") {
        localStorage.removeItem("accessToken");
        navigate("/login");
    } else {
        return err;
    }
}

