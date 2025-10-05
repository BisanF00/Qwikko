/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EditProfile() {
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

 const ToggleSwitch = ({ label, isOn, setIsOn }) => (
   <div
     className={`flex items-center justify-between p-4 rounded-full shadow-sm cursor-pointer transition-colors ${
       isOn ? "bg-green-500" : "bg-gray-200"
     }`}
     onClick={() => setIsOn(!isOn)}
   >
     <span
       className={`font-semibold transition-colors ${
         isOn ? "text-white" : "text-gray-700"
       }`}
     >
       {label}
     </span>
     <div className={`w-12 h-6 rounded-full relative transition-colors`}>
       <div
         className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-0.5 transition-transform`}
         style={{ transform: isOn ? "translateX(24px)" : "translateX(0)" }}
       ></div>
     </div>
   </div>
 );


  return (
      <div className="max-w-sm mx-auto mt-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          General Settings
        </h2>
        <ToggleSwitch
          label="Dark Mode"
          isOn={darkModeOn}
          setIsOn={setDarkModeOn}
        />
        <ToggleSwitch
          label="Notifications"
          isOn={notificationsOn}
          setIsOn={setNotificationsOn}
        />
      </div>
  );
}
