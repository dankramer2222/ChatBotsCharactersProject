import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps{
    params:{
        chatId:string;
    }
}


const ChatIdPage = async({
    params
}: ChatIdPageProps) => {
    const {userId} = auth();

    if(!userId){
        return redirectToSignIn();
    }
//fetch companion
const companion = await prismadb.companion.findUnique({
    where:{
        id:params.chatId
    },
    include:{
        messages:{
            orderBy:{
                createdAt:"asc",
            },
            where:{
                userId,
            }
        },
        _count:{
            select:{
                messages:true
            }
        }
    }
})

//check if we succesfully fetch companion

    if(!companion){
        return redirect
    }

    return (
        <ChatClient companion = {companion}/>
      );
}
 
export default ChatIdPage;