export const Navbar = ({loggedIn}) => {
    return (
        
        <nav class="bg-blue-200 text-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/" class="font-bold text-xl">MoneyMate</a>
                    </div>
                    <div class="flex">
                        <div class="hidden md:block">
                            <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">Home</a>
                            {!loggedIn && <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">Login</a>}
                            {!loggedIn && <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">Register</a>}
                            {loggedIn && <a href="/accounts" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">My Accounts</a>}
                            {loggedIn && <a href="/overview" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">My Overview</a>}
                            {loggedIn && <a href="/recurring" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">Recurring Transactions</a>}

                        </div>
                    </div>
                </div>
            </div>
        </nav>
        
        )
}