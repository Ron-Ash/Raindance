"use client";

import { useState } from "react";
import SocialPostCardBorder from "./SocialPostCard/SocialPostCardBorder";
import SocialPostCardContent from "./SocialPostCard/SocialPostCardContent";
import { motion } from "framer-motion";

export default function Test() {
  const [liked, setLiked] = useState(true);
  const variants = {
    expanded: { opacity: 1, height: "auto", scale: 1 },
    collapsed: { opacity: 1, height: 100, scale: 0.9 },
  };

  return (
    <SocialPostCardBorder>
      <SocialPostCardContent
        expanded={liked}
        collapsedOpacity={0}
        profilePic={"/cityPhotos/brisbane.jpg"}
        message={
          "Rome’s history spans over two and a half millennia, from its legendary founding by Romulus in 753 BCE to the fall of Constantinople in 1453 CE. Beginning as a small settlement on the Tiber River, it grew into a republic ruled by elected senators. Through military conquest and political innovation, Rome built an empire that stretched from Britain to Mesopotamia. Cultural achievements in law, architecture, and literature influenced civilization for centuries. Internal strife, economic pressures, and barbarian invasions eroded its power, leading to the Western Empire’s collapse in 476 CE. Meanwhile, the Eastern Roman Empire persisted as Byzantium until its eventual final demise."
        }
        attachmentPath={"/cityPhotos/brisbane.jpg"}
        time={"2025-06-08"}
        author={"memescollect"}
      />
      <motion.div
        variants={variants}
        initial="collapsed"
        animate={!liked ? "expanded" : "collapsed"}
        exit="collapsed"
        transition={{ duration: 0.3 }}
        className="border-3 rounded-xl p-1 justify-self-center overflow-hidden"
        onClick={() => setLiked((liked) => !liked)}
      >
        <SocialPostCardContent
          expanded={!liked}
          collapsedOpacity={1}
          profilePic={"/cityPhotos/brisbane.jpg"}
          message={
            "Rome’s history spans over two and a half millennia, from its legendary founding by Romulus in 753 BCE to the fall of Constantinople in 1453 CE. Beginning as a small settlement on the Tiber River, it grew into a republic ruled by elected senators. Through military conquest and political innovation, Rome built an empire that stretched from Britain to Mesopotamia. Cultural achievements in law, architecture, and literature influenced civilization for centuries. Internal strife, economic pressures, and barbarian invasions eroded its power, leading to the Western Empire’s collapse in 476 CE. Meanwhile, the Eastern Roman Empire persisted as Byzantium until its eventual final demise."
          }
          attachmentPath={"/cityPhotos/brisbane.jpg"}
          time={"2025-06-08"}
          author={"memescollect"}
        />
      </motion.div>
    </SocialPostCardBorder>
  );
}
