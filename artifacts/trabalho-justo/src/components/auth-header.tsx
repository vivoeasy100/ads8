import { Link } from "wouter";
import { useUserProfile } from "@/context/user-profile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, FileText } from "lucide-react";

export function AuthHeader() {
  const { profile, clearProfile, isLoggedIn } = useUserProfile();

  if (!isLoggedIn || !profile) {
    return (
      <Button size="sm" asChild variant="outline" className="text-xs">
        <Link href="/entrar">Entrar</Link>
      </Button>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-semibold leading-none truncate">{profile.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{profile.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile.phone}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/curriculos" className="flex items-center gap-2 cursor-pointer">
            <FileText className="h-4 w-4" />
            Meus Curriculos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/entrar" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Editar Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={clearProfile}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
