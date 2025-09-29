import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";


const Navbar = async () => {
    const session = await auth();

    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans text-black">
            <nav className="flex justify-between items-center ">
                <Link href="/">
                    <Image src='/logo.png' alt="logo" width={144} height={30} />
                </Link>

                <div className="flex items-center gap-5" >
                    {session && session.user ? (
                        <>
                            <Link href={"/startup/create"}>
                                <span>Create</span>
                            </Link>

                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Professores"/>
                                </SelectTrigger>
                            </Select>

                            <Link href={`/user/${session.user.id}`}>
                                <span>{session?.user?.name}</span>
                            </Link>

                            <form action={async () => {
                                "use server"
                                await signOut({ redirectTo: "/" })
                            }}>
                                <button type="submit" className="text-red-400">Logout</button>
                            </form>

                        </>
                    ) : (
                        <form action={async () => {
                            "use server"

                            await signIn('github')
                        }}>
                            <button type="submit">Login</button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;