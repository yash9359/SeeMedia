import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
const Modal = ({ openModal, onClose, children, initialWidth="max-w-md",initialHeight="h-[85vh]" }) => {

    const [show,setShow] = useState(false);
    const [mounted,setMounted] = useState(false)

    useEffect(()=>{
        if(openModal){
            setMounted(true);
            setTimeout(()=>setShow(true),10);
        }
        else{
            setShow(false);
            const timeout = setTimeout(()=>setMounted(false),300);
            return ()=> clearTimeout(timeout)
        }
    },[openModal])



    useEffect(()=>{
        if(mounted){
            document.body.style.overflow ="hidden"
        }
        else{
             document.body.style.overflow =""
        }
        return ()=> document.body.style.overflow =""
        },[mounted])

        if(!mounted) return null;




    return (
        // <Dialog open={open} onOpenChange={onOpenChange}>
        //     <DialogContent className={`p-0 border-none bg-transparent shadow-none overflow-visible [&>button]:z-50 [&>button]:top-[-16px] [&>button]:right-[-16px] [&>button]:text-white [&>button]:bg-zinc-800 [&>button]:rounded-full [&>button]:w-8 [&>button]:h-8 [&>button]:hover:bg-zinc-700 ${className || "sm:max-w-lg"}`}>
        //         {children}
        //     </DialogContent>
        // </Dialog>

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div onClick={onClose} className={`absolute inset-0 bg-black/30 backdrop-blur-sm  transition-opacity duration-300 ${show ? 'opacity-100' : "opacity-0"}`}/>
            <button onClick={onClose} className="absolute top-3 right-4 z-10 text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"><X size={28}/></button>

            <div className={`relative flex flex-col bg-black/30 rounded-xl border border-white overflow-hidden w-[90%] ${initialWidth} ${initialHeight}  justify-center items-center  transform transition-all duration-300 ${show ? "opacity-100 translate-y-0 scale-100 ease-out ": "opacity-0 translate-y-0 scale-95 ease-in " }`}>
            {children}</div>



        </div>
    )
}

export default Modal;