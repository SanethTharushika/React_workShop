import { createClient } from "@supabase/supabase-js";



const key= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aGFsa2p4YmNibXdocXd4d2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzkwMjIsImV4cCI6MjA5OTY1NTAyMn0.lPSZKScOpdSTmzDvMcXjRh96iOAZ_NCJaXrX1sfeZCU"
const url = "https://fuhalkjxbcbmwhqwxwgi.supabase.co"

const supabase = createClient(url, key);

export default function uploadMedia(file) {

    return new Promise(
        (resolve, reject) => {
            if (!file) {
                reject('Please choose a file first');
                return;
            }else{
                const timestamp = new Date().getTime();

                const fileName = timestamp + "_" + file.name;

                supabase.storage.from("images").upload(fileName, file).then(()=>{
                    const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                   
                    resolve(publicUrl);
                }).catch((error)=>{
                    reject(error);
                });

            }

        }
    )


}
