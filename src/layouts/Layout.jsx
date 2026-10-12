/* eslint-disable react/prop-types */
import { HeaderOne } from "../components/headers/HeaderOne";
import { FooterOne } from "../components/footers/FooterOne";
import { ScrollToTopButton } from "../components/scroll_to_top_btn/ScrollToTopButton";

export const Layout = ({ children }) => <>
  <HeaderOne />
  <main id="top">{children}</main>
  <FooterOne />
  <ScrollToTopButton />
</>;
