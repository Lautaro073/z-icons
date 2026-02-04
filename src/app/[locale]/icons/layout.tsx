interface IconsLayoutProps {
  children: React.ReactNode;
}

export default function IconsLayout({ children }: IconsLayoutProps) {
  return (
    <div className="relative px-10 py-10 h-full">
      <div className=" border border-border rounded-lg py-14 px-16 h-full">
        {children}
      </div>
    </div>
  )
}