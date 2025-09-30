import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


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

                            <DropdownMenu>
                                <DropdownMenuTrigger>Professores</DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem>
                                        <Link href={"/professor/cadastro"}>
                                            Cadastro
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href={"/professor/relatorio"}>
                                            Relatório
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger>Cursos</DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem>
                                        <Link href={"/curso/cadastro"}>
                                            Cadastro
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href={"/curso/relatorio"}>
                                            Relatório
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <span>{session?.user?.name}</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem>
                                        <Link href={`/usuario/${session.user.id}`}>
                                            Meu Perfil
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <form action={async () => {
                                            "use server"
                                            await signOut({ redirectTo: "/" })
                                        }}>
                                            <button type="submit" className="text-red-400">Logout</button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </>
                    ) : (
                        // <form action={async () => {
                        //     "use server"

                        //     await signIn('github')
                        // }}>
                        //     <button type="submit">Login</button>
                        // </form>
                        <Link href={'/usuario/login'}>Entrar</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;