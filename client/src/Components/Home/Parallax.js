import React, { useEffect } from "react";
import M from "materialize-css";
import midbg from "../../Images/midbg.jpg";
import sewing from "../../Images/sewingmachine.jpg";
import UserStory from "./UserStory";

const Parallax = () => {
  useEffect(() => {
    let elements = document.querySelectorAll(".parallax");
    M.Parallax.init(elements);
  }, []);

  return (
    <section>
      <div className='parallax-container'>
        <div className='parallax'>
          <img className='responsive-img' src={midbg} alt='thread' />
        </div>
      </div>
      <UserStory />
      <div className='parallax-container'>
        <div className='parallax'>
          <img className='responsive-img' src={sewing} alt='stitchandbatton' />
        </div>
      </div>
    </section>
  );
};

export default Parallax;
