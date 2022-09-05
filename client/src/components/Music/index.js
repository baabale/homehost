import React, { useCallback, useEffect, useState }  from 'react';
import { Outlet } from "react-router-dom";

import SideBar from "../MusicSidebar/SideBar";
import MusicHeader from "../MusicHeader/MusicHeader"
import NowPlayingBar from "../NowPlayingBar/NowPlayingBar";
import style from "./Music.module.css"

const Music = () => {

  useEffect(() => {
    document.documentElement.className = ""; //<head>
    document.body.className = style.MusicBody; //<body>
  });

  return (
      <div className={style.App}>
        <SideBar />
        <MusicHeader account={{display_name: "User"}}/>
          <Outlet />
        <NowPlayingBar />
      </div>
  );
};

export default Music;