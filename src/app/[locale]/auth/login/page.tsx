import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { ZIcon } from "@zcorvus/z-icons/react";
import { getTranslations } from "next-intl/server";
import { ProviderLogin } from "./provider";

export default async function LoginPage() {
  const auth = await getTranslations('auth');
  const common = await getTranslations('common');

  return (
    <div className="flex flex-col gap-10 sm:w-[300px]">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-lg uppercase">{auth('screens.signIn.title')}</h1>
        <p className="text-muted-foreground text-sm leading-none">{auth('screens.signIn.subtitle')}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Input type="email" placeholder={common('fields.email')} />
        <Input type="password" placeholder={common('fields.password')} />

        <div className="flex gap-2 justify-end mt-2">
          <Link href="/auth/signup">
            <Button variant="outline" size="icon">
              <ZIcon type="mina" name="plus" />
            </Button>
          </Link>
          <Button className="w-fit">
            <p>
              {auth('actions.signIn')}
            </p>
          </Button>

        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 relative">
          <div className="h-px w-full bg-muted-foreground/30 absolute top-1/2 z-0 left-0 right-0" />
          <p className="text-muted-foreground text-center px-2 bg-background z-10 text-sm transition-colors duration-300">{auth('oauth.separator')}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ProviderLogin />
        </div>
      </div>

    </div>
  )
}

