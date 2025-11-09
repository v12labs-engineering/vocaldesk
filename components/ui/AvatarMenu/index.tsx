import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AvatarIcon } from "@radix-ui/react-icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';

interface AvatarMenuProps {
    user: any;
    signOut: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AvatarMenu({ user, signOut }: AvatarMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <AvatarIcon className="h-[1.5rem] w-[1.5rem]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>Profile</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                <DropdownMenuGroup>
                    {/* <DropdownMenuItem>
                        <Link href="/account">
                            Account
                        </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => signOut(e)}>
                            <button type="submit">
                                Sign Out
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}