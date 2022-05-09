import noblox_js from 'noblox.js';

const checkTokenInBlurb = (roblox_user_id, token) =>{
    return new Promise((resolve, reject) => {
        noblox_js.getBlurb(roblox_user_id)
        .then(blurb => {
            if(blurb.includes(token)){
                resolve(true);
            }else{
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        }
        );
    }
    );
}

export default {
    checkTokenInBlurb
}


