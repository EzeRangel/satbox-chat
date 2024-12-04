export default function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    const ms = seconds * 1000;

    setTimeout(() => {
      resolve();
    }, ms);
  });
}
