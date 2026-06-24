import { useState } from "react";

export default function LikeButton(){
    const [like, setLike] = useState(false);
    let likeColor = {color : 'red'};

    let likeButton = () => {
        setLike(!like);
        console.log(like);
    }
    return (
        <>
            <p onClick={likeButton}>
                {
                    like ? <i className="fa-solid fa-heart" style={likeColor}></i> : <i className="fa-regular fa-heart" ></i>
                }
            </p>
        </>
    )
}
