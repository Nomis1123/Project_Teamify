import React from 'react'
import { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatFriendsList from "../components/ChatFriendsList"
import ChatWindow from '../components/ChatWindow';

const Chat = ({ target = null }) => {
    const [friends_list, setFriendsList] = useState([
        {username: "Man!", userid: 12, pfp_url: "https://motionbgs.com/media/474/arknights.jpg", unread: ""},
        {username: "Doggggggggggggg", userid: 111111111111111111, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 1, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 2, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: "You have unread messages"},
        {username: "Dog", userid: 3, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 4, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 5, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 6, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 7, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 8, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
        {username: "Dog", userid: 9, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", unread: ""},
    ]);
    const [conversation_id , setConversationID] = useState(null);
    const [messages, setMessages] = useState([
        { sender: 12, message: "aaa", timestamp: "2026-03-16 18:59" },
        { sender: 7, message: "hey, are you free tonight?", timestamp: "2026-03-16 19:01" },
        { sender: 12, message: "yeah, mostly. I still need to finish a bit of work, but I should be free after dinner if you want to talk or work on something together.", timestamp: "2026-03-16 19:03" },
        { sender: 7, message: "nice, I was thinking we could go over the project because I’m still a little confused about how the chat state is supposed to flow between the parent component and the friend list component.", timestamp: "2026-03-16 19:05" },
        { sender: 12, message: "sure, that makes sense. I think the cleanest way is to keep the current target in the parent and pass both the target value and a modifier function down as props, instead of trying to manage the same state in multiple places.", timestamp: "2026-03-16 19:07" },
        { sender: 7, message: "that was my guess too, but I got confused when I tried to create a local state from the prop and then it stopped syncing after the prop changed.", timestamp: "2026-03-16 19:08" },
        { sender: 12, message: "yeah, that happens because useState(target) only uses the prop as the initial value. After that, the local state is independent unless you explicitly sync it with a useEffect that listens to target.", timestamp: "2026-03-16 19:10" },
        { sender: 7, message: "ok that explains a lot actually", timestamp: "2026-03-16 19:11" },
        { sender: 7, message: "also I fixed the key warning, but then it turned out I had put the key on the img instead of the button returned by map, which is kind of annoying in hindsight.", timestamp: "2026-03-16 19:12" },
        { sender: 12, message: "that is a super common mistake. React only cares about the key on the top-level element directly returned by the map call, so if the button is the outermost returned element, the key has to go there.", timestamp: "2026-03-16 19:14" },
        { sender: 7, message: "I’m also trying to make the friends list scroll, but right now the section just grows forever instead of becoming scrollable.", timestamp: "2026-03-16 19:16" },
        { sender: 12, message: "then the problem is probably that the list does not have a constrained height. overflow only works when the content is larger than the available box, so if the box is allowed to grow naturally, there is nothing to scroll.", timestamp: "2026-03-16 19:18" },
        { sender: 7, message: "I gave it overflow auto, display flex, and flex-direction column, but I didn’t set a height because I wanted it to just take the remaining space.", timestamp: "2026-03-16 19:20" },
        { sender: 12, message: "in that case the parent should be a flex column container and the list should use flex: 1 with min-height: 0. That usually makes it fill the remaining space and actually allow scrolling inside instead of forcing the container to expand.", timestamp: "2026-03-16 19:22" },
        { sender: 7, message: "I always forget about min-height: 0 in flex layouts.", timestamp: "2026-03-16 19:23" },
        { sender: 12, message: "same, but it matters a lot. Without it, flex children often refuse to shrink enough, so the overflow ends up happening in the wrong place or not visibly at all.", timestamp: "2026-03-16 19:25" },
        { sender: 7, message: "by the way, I was also seeing an error about updating Chat while rendering ChatFriendsList. I think it was because I accidentally called the state setter directly inside the render instead of passing a function to onClick.", timestamp: "2026-03-16 19:28" },
        { sender: 12, message: "yes, exactly. If you write onClick={setCurrTarget(user.userid)}, that runs immediately during render. You want onClick={() => setCurrTarget(user.userid)} so it only runs when the button is actually clicked.", timestamp: "2026-03-16 19:30" },
        { sender: 7, message: "that warning message sounded dramatic, but at least the fix was simple once I understood what it meant.", timestamp: "2026-03-16 19:31" },
        { sender: 12, message: "React warnings often sound scary, but they usually point to a very specific pattern that it does not want you to use. Once you learn the pattern, the warning starts to make more sense.", timestamp: "2026-03-16 19:33" },
        { sender: 7, message: "now I’m testing the chat window with fake messages because the API is not fully done yet, so I just need a decent amount of sample data to see what wrapping, scrolling, spacing, and long-message layout will look like.", timestamp: "2026-03-16 19:36" },
        { sender: 12, message: "that is a good idea. You should test short messages, really long messages, messages with punctuation, and messages that wrap across several lines, because all of those can affect alignment and spacing in slightly different ways.", timestamp: "2026-03-16 19:38" },
        { sender: 7, message: "yeah, especially because I want the bubbles to look fine both for very small messages like 'ok' and for long messages that span multiple lines and maybe include commas, numbers, or things that look more like real text.", timestamp: "2026-03-16 19:40" },
        { sender: 12, message: "you should also test a case where one person sends several messages in a row, because sometimes the vertical spacing or border radius looks a little weird when consecutive messages from the same sender are stacked together.", timestamp: "2026-03-16 19:42" },
        { sender: 7, message: "good point, I had not thought about grouped messages yet.", timestamp: "2026-03-16 19:43" },
        { sender: 12, message: "another useful test is timestamps with different lengths or formats. Even though yours look consistent right now, it helps to see whether the layout still behaves nicely when a line gets crowded.", timestamp: "2026-03-16 19:45" },
        { sender: 7, message: "I might hide the scrollbar too, but still allow the area to scroll. I saw a CSS trick for that and wanted to try it because I want the chat panel to look cleaner.", timestamp: "2026-03-16 19:47" },
        { sender: 12, message: "that works, but just make sure it still feels obvious that the section can scroll. Hidden scrollbars look nice, but sometimes users miss that more content exists below unless the layout gives them some kind of hint.", timestamp: "2026-03-16 19:49" },
        { sender: 7, message: "true. I might leave the scrollbar visible for now while I’m debugging and only hide it later if the rest of the layout feels stable.", timestamp: "2026-03-16 19:50" },
        { sender: 12, message: "that is probably better. It is easier to debug overflow and height issues when you can actually see where the scrollable region is and whether the browser thinks it should scroll.", timestamp: "2026-03-16 19:52" },
        { sender: 7, message: "once I finish the layout, I also want to add auto-scroll to the newest message, but I do not want it to be annoying if the user has manually scrolled up to read older messages.", timestamp: "2026-03-16 19:55" },
        { sender: 12, message: "then you probably want conditional auto-scroll. A common approach is to auto-scroll only when the user is already near the bottom, and avoid forcing them back down if they intentionally scrolled upward to read older content.", timestamp: "2026-03-16 19:57" },
        { sender: 7, message: "that sounds reasonable. I was worried I would need some complicated logic, but checking whether the current scroll position is close to the bottom seems manageable.", timestamp: "2026-03-16 19:59" },
        { sender: 12, message: "yeah, it is not too bad. Usually you compare scrollHeight, scrollTop, and clientHeight, and then decide whether the user is close enough to the bottom that an automatic jump will feel natural instead of disruptive.", timestamp: "2026-03-16 20:01" },
        { sender: 7, message: "thanks, this actually cleared up a lot. I think I’ll rework the parent container with flex first, then fix the list height and scrolling, and after that I’ll go back to the chat message styling.", timestamp: "2026-03-16 20:03" },
        { sender: 12, message: "that order makes sense. Layout first, then overflow and scrolling, then visual polish. It is usually much easier than trying to style everything before the structure of the page is stable.", timestamp: "2026-03-16 20:05" },
        { sender: 7, message: "I’ll probably message you again later if I get stuck on the auto-scroll part or if the flex container still refuses to behave.", timestamp: "2026-03-16 20:06" },
        { sender: 12, message: "sounds good. Send the JSX and CSS together if that happens, because with layout bugs the parent container styles are often just as important as the child styles.", timestamp: "2026-03-16 20:08" },
        { sender: 7, message: "will do. For now I’m just going to plug in this fake message list and make sure the interface looks normal with both short and long messages before I connect everything to the real backend.", timestamp: "2026-03-16 20:10" }
        ]);
    const [loading_fl, setLoadingFL] = useState(false);
    const [loading_ch, setLoadingCH] = useState(false);
    const [connected, setConnected] = useState(false);
    const [currTarget, setCurrTarget] = useState(target);
    const [user, setUser] = useState({
        id: 12,
        username: "Man!",
        pfp_url: "https://motionbgs.com/media/474/arknights.jpg",
    });

    // Get the user's friend list, info and build live chat
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingFL(true);

                // Get the user's friends list
                const res = await fetch("???", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const normalized_friends = data.friends_list.map((friend) => ({
                    id: friend.id ?? "",
                    username: friend.username ?? "",
                    profile_picture: friend.profile_picture ?? "",
                    unread: "You have unread messages",
                }));
                // console.log("response data:", data);
                setFriendsList(normalized_friends);

                setLoadingFL(true);
                // Get user info
                res = await fetch("/api/user/me", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                data = await res.json();
                // console.log("response data:", data);
                const normalized_user = {
                    id: data.user.id ?? "",
                    username: data.user.username ?? "",
                    profile_picture: data.user.profile_picture ?? "",
                };
                setUser(normalized_user);

                // Setup the live chat connection
                const ws = new WebSocket(`ws://localhost:8000/ws/${user.id}`);
                socketRef.current = ws;

                ws.onopen = () => {
                    setConnected(true);
                    console.log("WebSocket Connection ON");
                };

                ws.onmessage = (event) => {
                    const msg = JSON.parse(event.data);

                    const income_conversation_id = msg.conversation_id;

                    const newMsg = {
                        message: msg.message,
                        sender: msg.sender,
                        timestamp: msg.timestamp,
                    }

                    if (income_conversation_id = conversation_id) {
                        setMessages((prevMessages) => [
                            newMsg,
                            ...prevMessages,
                        ]);
                    } else {
                        const target_friend = friends_list.find((f) => f.conversation_id = income_conversation_id);
                        target_friend.unread = newMsg.message;
                    }
                };

                ws.onclose = () => {
                    setConnected(false);
                    console.log("WebSocket Connection OFF");
                };

                ws.onerror = (e) => {
                    console.log(`WebSocket Error: ${e}`)
                }
            } catch (e) {
                console.log("error:", e);
            } 
        };
        loadMe();
    }, []);

    useEffect(() => {
        console.log("User's friends list:", friends_list);
    }, [friends_list]);

    // Get the conversation_id between current user and the target user and set the messages
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingCH(true);

                const res = await fetch("/api/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                    body: {target_id: target},
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                setConversationID(data.conversation_id);

                res = await fetch(`/api/conversations/${conversation_id}/messages`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                data = await res.json();
                // console.log("response data:", data);
                setMessages(data.messages);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingCH(false);
            }
        };
        loadMe();
    }, [currTarget]);

    useEffect(() => {
        console.log("Changed the chatting target to ", currTarget);
    }, [currTarget]);

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingCH(true);

                const res = await fetch("/api/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                    body: {target_id: target},
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                setConversationID(data.conversation_id);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingCH(false);
            }
        };
        loadMe();
    }, [currTarget]);

    return (
        <div className="chat-page">
            <div className='chat-window'>
                {currTarget ? 
                    <ChatWindow 
                        messages={messages} 
                        target={currTarget} 
                        friends_list={friends_list} 
                        user={user} 
                    /> : 
                    <span>Select a friend to start a chat</span>}
            </div>
            <div className='chat-friend-list'>
                <ChatFriendsList 
                    friends_list={friends_list} 
                    target={currTarget} 
                    targetModifier={setCurrTarget}
                />
            </div>
    
        </div>
    );
};

export default Chat;