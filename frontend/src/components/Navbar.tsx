import m, { Vnode } from 'mithril';
import { AuthClient } from '../AuthClient';

export default class Navbar {

    view() {
        return <nav>
          <div class="container mx-auto px-6 py-2 flex justify-between items-center">
            <a class="font-bold text-2xl lg:text-4xl" href="#">
              staklist
            </a>
            <div class="block lg:hidden">
              <button class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-800 hover:border-gray-500 appearance-none focus:outline-none">
                <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>
            <div class="hidden lg:block">
              <ul class="inline-flex">
                <li><a class="px-4 font-bold" href="#!/signin">Log in</a></li>
                <li><a class="px-4 hover:text-gray-800" href="#">Register</a></li>
              </ul>
            </div>
          </div>
        </nav>
        // return <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
        //     <div class="container">
        //         <div class="navbar-brand">
        //             <a class="navbar-item navbar__logo" href="/#!">
        //                 fu-du
        //             </a>

        //             <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        //                 <span aria-hidden="true"></span>
        //                 <span aria-hidden="true"></span>
        //                 <span aria-hidden="true"></span>
        //             </a>
        //         </div>

        //         <div id="navbarBasicExample" class="navbar-menu">
        //             <div class="navbar-start">

        //             </div>


        //             {AuthClient.user.userId ?
        //                 <div class="navbar-end">
        //                     <div class="navbar-item">
        //                         {AuthClient.user.userId}
        //                     </div>
        //                     <div class="navbar-item">
        //                         <div class="buttons">
        //                             <a class="button is-light" onclick={async () => await AuthClient.logout()}>
        //                                     Sign out
        //                             </a>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 :
        //                 <div class="navbar-end">
        //                     <div class="navbar-item">
        //                         <div class="buttons">
        //                             <a class="button is-light" onclick={() => {}}>
        //                                 Register
        //                             </a>
        //                         </div>
        //                     </div>
        //                     {/* <div class="navbar-item">
        //                         Already have an account?
        //                     </div> */}
        //                     <div class="navbar-item">
        //                         <div class="buttons">
        //                             <a class="button is-light" href='#!/signin'>
        //                                 Sign in
        //                             </a>
        //                         </div>
        //                     </div>
                            
                            
        //                 </div>
        //             }
        //         </div>
        //     </div>
        // </nav>
    }

}

