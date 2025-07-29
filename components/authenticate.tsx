import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FcGoogle } from "react-icons/fc"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { X } from "lucide-react"

interface AuthenticateProps {
  show?: boolean;
  onClose?: () => void;
}

const Authenticate = ({ show = true, onClose }: AuthenticateProps) => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: 'https://textbehindimage.site/app'
      },
    })

    if (error) {
      toast({
        title: "🔴 Something went wrong",
        description: "Please try again.",
      })
    }
  }

  return (
    <AlertDialog open={show}>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        {onClose && (
          <Button
            variant="ghost"
            className="absolute right-4 top-4 h-4 w-4 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>Authenticate with Google</AlertDialogTitle>
          <AlertDialogDescription>To continue, please sign in with your Google account.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" className="w-full gap-2" onClick={() => signInWithGoogle()}>
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Authenticate
