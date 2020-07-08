import m from 'mithril';
import { AuthClient } from '../generic/login/authclient';

export default class Navbar {

    showMobileMenu = false;

    view() {
        return <nav>
          <div class="container mx-auto px-6 py-2 flex justify-between items-center">
            <a class="font-bold text-2xl lg:text-4xl" href="#">
            sourcestack demo
            </a>
            <div class="block lg:hidden">
              <button class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-800 hover:border-gray-500 appearance-none focus:outline-none"
                onclick={() => this.showMobileMenu = !this.showMobileMenu}>
                <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
              
            </div>
            
            <div class="hidden lg:block">
                {AuthClient.user.userId ?
                    <ul class="inline-flex">
                        <li>{AuthClient.user.userId}</li>
                        <li><a class="px-4 bg-gray-500 ml-5 p-2 text-white rounded" href="#" onclick={this.logout}>Log out</a></li>
                    </ul>
                :
                    <ul class="inline-flex">
                        
                        <li><a class="px-4 font-bold" href="#!/login">Log in</a></li>
                        <li><a class="px-4 hover:text-gray-800" href="#!/signup">Register</a></li>
                    </ul>
                }
            </div>
          </div>
          <div class="block lg:hidden">
            {this.showMobileMenu && <div class="px-8 py-5">
                {AuthClient.user.userId ?
                    <ul class="text-right">
                        <li class="pb-5">{AuthClient.user.userId}</li>
                        <li><a href="#" class="underline" onclick={this.logout}>Log out</a></li>
                    </ul>
                :
                    <ul class="text-right">
                        <li class="pb-5"><a class="underline" href="#!/login">Log in</a></li>
                        <li><a class="underline" href="#!/signup">Register</a></li>
                    </ul>
                }
              </div>}
            </div>
        </nav>
    }

    async logout(){
        await AuthClient.logout();
        m.route.set('/splash');
    }

}

