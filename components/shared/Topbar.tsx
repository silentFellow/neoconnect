import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import Link from 'next/link';

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className='flex items-center gap-4'>
        <Image
          src="/assets/logo.svg"
          alt="logo"
          height={28}
          width={28}
        />
        <p className='text-light-1 text-heading3-bold max-xs:hidden'>Neoconnect</p>
      </Link>

      {/* mobile logout */}
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  height={24}
                  width={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />

      </div>
    </nav>
  )
}

export default Topbar;
