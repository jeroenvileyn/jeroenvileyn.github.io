const outputEl = document.querySelector("#terminal-output");
const inputEl = document.querySelector("#terminal-input");

const files = {
  "aboutme.txt": {
    content: `
I'm a cybersecurity student focused on ethical hacking, networking,
and understanding how real-world attacks work so I can defend against them.
`.trim(),
    size: 180,
    hidden: false
  },

  "skills.txt": {
    content: `
Skills:
- Linux, Bash
- Networking
- Python
- Digital forensics basics
`.trim(),
    size: 120,
    hidden: false
  },

  "projects.txt": {
    content: `
Projects:
- Homelab with VMs
- CTF writeups
- Security scripts
`.trim(),
    size: 140,
    hidden: false
  },

  "contact.txt": {
    content: `
Contact:
- Email: your@email.com
- GitHub: github.com/yourusername
`.trim(),
    size: 90,
    hidden: false
  },

  ".hidden.txt": {
    content: `
This is a hidden secret file :)
Maybe an easter egg?
`.trim(),
    size: 60,
    hidden: true
  },

};


function printLine(text="") {
  outputEl.textContent += "\n" + text;
  outputEl.scrollTop = outputEl.scrollHeight;
}

function handleCommand(cmd) {
  const trimmed = cmd.trim();
  if (!trimmed) return;

  printLine(`$ ${trimmed}`);

  // split command + args
  const [base, ...args] = trimmed.split(" ");
  const lowerBase = base.toLowerCase();

  // main commands
  if (lowerBase === "help") {
    printLine("help, ls, ls -a, ls -l, ls -la, cat <file>, clear");
  }

  else if (lowerBase === "ls") {

    // ls
    if (args.length === 0) {
      printLine(
        Object.keys(files)
          .filter(name => !name.startsWith("."))
          .join("  ")
      );
    }

    // ls -a
    else if (args[0] === "-a") {
      printLine(Object.keys(files).join("  "));
    }

    // ls -l
    else if (args[0] === "-l") {
      Object.entries(files)
        .filter(([name]) => !name.startsWith("."))
        .forEach(([name, file]) => {
          printLine(`-rw-r--r-- 1 user user ${file.size} Feb 19 ${name}`);
        });
    }

    // ls -la / ls -al
    else if (args[0] === "-la" || args[0] === "-al") {
      Object.entries(files).forEach(([name, file]) => {
        const perms = file.hidden ? "-rw-------" : "-rw-r--r--";
        printLine(`${perms} 1 user user ${file.size} Feb 19 ${name}`);
      });
    }

    else {
      printLine("ls: invalid option");
    }
  }

else if (lowerBase === "cat") {
  if (args.length === 0) {
    printLine("usage: cat <file>");
  } else {
    const fileName = args[0].toLowerCase();

    // virtual system files
    if (fileName === "/etc/passwd") {
      printLine(`
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
jvileyn:x:1000:1000:Jeroen:/home/jvileyn:/bin/zsh
Must say, nice find!
`.trim());
      printLine();
      return;
    }

    // normal files
    if (files[fileName]) printLine(files[fileName].content);
    else printLine(`cat: ${fileName}: No such file or directory`);
  }
}

  else if (lowerBase === "clear") {
    outputEl.textContent = "";
  }

  else {
    printLine(`${base}: command not found`);
  }

  printLine();
}


inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    handleCommand(inputEl.value.trim());
    inputEl.value = "";
  }
});
