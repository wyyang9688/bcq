import { runBuild, runDev } from "@dcloudio/vite-plugin-uni/dist/cli/action";
import { Command } from "commander";
import { PLATFORMS } from "@dcloudio/vite-plugin-uni/dist/cli/utils";
import inquirer from "inquirer";
import { readdirSync } from "node:fs";
import figlet from "figlet";
import ora from "ora";
import chalk from "chalk";
import { createManifest } from './tools/create-manifest'
console.log(
    chalk.green(
        figlet.textSync("Hentre BCQ!", {
            // font: "Ghost",
            horizontalLayout: "default",
            verticalLayout: "default",
            // width: 80,
            whitespaceBreak: true
        })
    )
);
const spinner = ora(`${chalk.green("开始启动")}`).start();
spinner.color = "green";

const program = new Command();
const platform = "mp-weixin";
program
    .name("AI")
    .description("CLI to some JavaScript string utilities")
    .version("0.8.0");

program
    .command("split")
    .description("Split a string into substrings and display as an array")
    .argument("<string>", "string to split")
    .option("--first", "display just the first substring")
    .option("-s, --separator <char>", "separator character", ",")
    .action((str, options) => {
        const limit = options.first ? 1 : undefined;
        console.log(str.split(options.separator, limit));
    });
program
    .command("run")
    .description("start  server")
    .argument("[string]", "modalType", "dev")
    .option("-p ,--platform [string]", "select platfroms", "mp-weixin")
    .option("-e ,--env [string]", "select env", "dev")
    .action(async (arg, { platform, env }) => {
        process.env.PROJECTENV = env;
        await Promise.all([
            createManifest(),
          ]).catch((err) => {
            process.exit(1)
          })
        if (PLATFORMS.includes(platform)) {
            if (arg == "dev") {
                runDev({ platform, ssr: false });
            } else {
                runBuild({ platform, ssr: false });
            }
        } else {
            console.log(`${chalk.red("Error 暂不支持")}`);
        }
    });

const envList = readdirSync("env").map((env) => env.replace(".env.", ""));

program.parse(process.argv);
spinner.succeed("success");
spinner.stop();
