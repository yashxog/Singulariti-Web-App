import { ThemeProvider } from "next-themes";

const ThemeProviderComponent = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <ThemeProvider attribute="class" enableSystem={false}>
            {children}
        </ThemeProvider>
    )
}

export default ThemeProviderComponent;