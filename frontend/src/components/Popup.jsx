import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FriendRequests } from "@/components/FriendRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Explore } from "@/components/Explore";
import { Friends } from "@/components/Friends";

export const Popup = () => {
  const [tabs] = useState([
    { comp: Explore, label: "Explore" },
    { comp: FriendRequests, label: "Requests" },
    { comp: Friends, label: "Friends" },
  ]);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <>
      <div className="h-[55vh] flex flex-col">
        <nav className="px-1 pt-1 pb-[2px] border-b border-b-[#eeeeee]">
          <ul className="list-none p-0 m-0  font-semibold text-base flex">
            {tabs.map((item, i) => (
              <li
                key={i}
                className={`${
                  item === selectedTab ? "bg-[#eee]" : ""
                } list-none font-sans text-[14px] rounded border-b-0 border-r-0 border-l-0 border-gray-300 w-full py-2 px-3 relative bg-white cursor-pointer flex justify-center items-center flex-1 min-w-0 user-select-none`}
                onClick={() => setSelectedTab(item)}
              >
                {`${item.label}`}
                {item === selectedTab ? (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#8855ff]"
                    layoutId="underline"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <ScrollArea className="flex flex-grow p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab ? <selectedTab.comp /> : "😋"}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </div>
    </>
  );
};
