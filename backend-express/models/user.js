import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        email : {
            type : String,
            unique : true,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        isAdmin : {
            type : Boolean,
            required : true,
            default : false
        },
        isBlocked : {
            type : Boolean,
            default : false,
            required : true
        },
        isEmailVerified : {
            type : Boolean,
            default : false,
            required : true
        },
        image : {
            type : String,
            required : true,
            default : "/default-profile.png"
        }
    }
)

const User = mongoose.model("User", userSchema);

export default User;