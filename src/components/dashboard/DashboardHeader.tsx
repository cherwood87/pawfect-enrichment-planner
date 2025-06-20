import { MessageSquare, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useDog } from "@/contexts/DogContext";

interface DashboardHeaderProps {
	onChatOpen: () => void;
	onAddDogOpen: () => void;
}

// Add a console log for debug
const DashboardHeader = (props: DashboardHeaderProps) => {
	console.log("[DashboardHeader] Rendering");
	const { user, signOut } = useAuth();
	const { currentDog } = useDog();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/auth");
		} catch (error) {
			console.error("Sign out failed:", error);
		}
	};

	return (
		<header className="bg-background border-b sticky top-0 z-50">
			<div className="flex h-16 items-center px-4">
				<Button variant="ghost" className="mr-4 lg:hidden">
					{/*  */}
				</Button>
				<div className="ml-auto flex items-center space-x-4">
					<ModeToggle />
					{currentDog && (
						<Button variant="ghost" size="sm" onClick={props.onChatOpen}>
							<MessageSquare className="mr-2 h-4 w-4" />
							Chat
						</Button>
					)}
					<Button variant="ghost" size="sm" onClick={props.onAddDogOpen}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Dog
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={user?.user_metadata?.avatar_url as string}
										alt={user?.email as string}
									/>
									<AvatarFallback>
										{user?.email?.[0].toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate("/settings")}>
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleSignOut}>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};
export default DashboardHeader;
