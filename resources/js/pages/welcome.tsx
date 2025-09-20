import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="mb-6">
                                <h2 className="mb-3 font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Features</h2>
                                <ul className="mb-4 flex flex-col gap-2">
                                    <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                        <span className="relative bg-white py-1 dark:bg-[#161615]">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                            </span>
                                        </span>
                                        <span>
                                            <strong>Stream Management:</strong> Create, read, update, and delete streams with full validation
                                        </span>
                                    </li>
                                    <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                        <span className="relative bg-white py-1 dark:bg-[#161615]">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                            </span>
                                        </span>
                                        <span>
                                            <strong>Stream Types:</strong> Manage different categories and types of streams
                                        </span>
                                    </li>
                                    <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                        <span className="relative bg-white py-1 dark:bg-[#161615]">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                            </span>
                                        </span>
                                        <span>
                                            <strong>User Management:</strong> Complete user CRUD operations with authentication
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-3 font-medium text-[#1b1b18] dark:text-[#EDEDEC]">How to Use</h2>
                                <ul className="mb-4 flex flex-col gap-2">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                            <strong>API Endpoints:</strong> All endpoints are available at{' '}
                                            <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">/api/</code>
                                        </span>
                                    </li>
                                    <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                        <span className="relative bg-white py-1 dark:bg-[#161615]">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                            </span>
                                        </span>
                                        <span>
                                            <strong>Interactive Docs:</strong> Test endpoints directly in Swagger UI
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                            <strong>Web Interface:</strong> Manage data through the intuitive web dashboard
                                    </span>
                                </li>
                            </ul>
                            </div>

                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href="/idoc"
                                        target="_blank"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        API Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/login"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-100 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-blue-900/20 dark:to-indigo-900/30">
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <div className="mb-6">
                                    <div className="mx-auto mb-4 flex ">
                                        <img src="data:image/png;base64,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" />
                                    </div>
                                    <h1 className="mb-1 font-medium">One Stream CRUD API</h1>
                                    <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                        A comprehensive REST API for managing streams and stream types with full CRUD operations.
                                        <br />
                                        Built with Laravel 12, featuring PostgreSQL database, Swagger documentation, and modern web interface.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
