// https://vitejs.dev/guide/features#client-types
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
