"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { ZIcon } from "@zcorvus/z-icons/react";
import { useTranslations } from "next-intl";
import { useLocale } from 'next-intl';
import { useRouter } from "next/navigation";

const UserProfileCard = () => {
  const { data, isPending } = authClient.useSession();
  const auth = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  const formatDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric"
  }).format(data?.user?.createdAt)

  console.log(data);
  const handleSignOut = () => {
    authClient.signOut();
    router.push('/auth/login');
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!data) {
      router.push('/auth/login');
      e.stopPropagation();
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          aria-label="Toggle theme"
          className={cn("flex items-center gap-3", data && "uppercase")}
          onClick={handleClick}
        >

          {isPending && <div className="w-20 h-2 rounded-full bg-muted-foreground/20 animate-pulse" />}

          {!isPending && <>
            <p>{data?.user?.name || auth("actions.signIn")}</p>
            {data && <div className="h-2 w-2 rounded-full bg-green-500" />}
          </>}

        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex gap-8 flex-col w-[500px] py-8"
        side="bottom"
        align="end"
        sideOffset={12}
        alignOffset={0}
      >
        <div className="grid grid-cols-[1fr_4fr] lg:grid-cols-[90px_1fr] gap-8">
          <div className="grid place-items-center rounded-full bg-border h-24 w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img width={90} height={90} src={data?.user?.image ?? ""} alt="" />
          </div>
          <section className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="text-muted-foreground uppercase text-xs">Name</h2>
              <p className="leading-tight">{data?.user?.name}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-muted-foreground uppercase text-xs">Email Address</h2>
              <p className="leading-tight">{data?.user?.email}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-muted-foreground uppercase text-xs">Language</h2>
              <p className="leading-tight">English (United States)</p>
            </div>
          </section>
          <Button className="absolute top-4 right-4">
            <ZIcon type="mina" name="pencil" />
            <p>Edit Profile</p>
          </Button>

        </div>
        <div className="border-t border-muted-foreground/30 flex justify-between">
          <div className="flex gap-8">
            <div className="pt-8">
              <h2 className="text-muted-foreground uppercase text-xs">Account Status</h2>
              <p className="text-green-500">• Active</p>
            </div>
            <div className="h-[94px] w-px bg-muted-foreground/30" />
            <div className="pt-8">
              <h2 className="text-muted-foreground uppercase text-xs">Member Since</h2>
              <p>{formatDate}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant={"ghost"} size="icon" onClick={handleSignOut}>
              <ZIcon type="mina" name="logout" className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { UserProfileCard } 
