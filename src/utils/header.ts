import chalk from "chalk";

export function printHeader(label: string): void {
  const cols = process.stdout.columns ?? 40;
  const padded = `  ${label}  `;
  const fill = "─".repeat(Math.max(0, Math.floor((cols - padded.length) / 2)));
  console.log(chalk.bold.cyan(`${fill}${padded}${fill}\n`));
}
