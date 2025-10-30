import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

export default function About() {
  return (
    <>
      <Title>About</Title>
      <main class="text-center mx-auto text-gray-700 p-4 font-pixel">
        {/*
          ,-.      .-,
          |-.\ __ /.-|
          \  `    `  /
          / _     _  \
          | _`q  p _ |
          '._=/  \=_.'
          {`\()/`}`\
          {      }  \
          |{    }    \
          \ '--'   .- \
          |-      /    \
          | | | | |     ;
          | | |.;.,..__ |
          .-"";`         `|
          /    |           /
          `-../____,..---'`
        */}
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
          NOTHING HERE
        </h1>
        <div class="bg-[url('fox.png')] bg-bottom-right bg-no-repeat min-h-64"></div>
        <h2>
          The quick brown fox jumped over{" "}
          <span class="text-black dark:text-white">absolutely nothing.</span>
        </h2>
        <p class="my-4">
          <A href="/" class="text-sky-600 hover:underline">
            Home
          </A>
          {" - "}
          <span>About</span>
        </p>
      </main>
    </>
  );
}
