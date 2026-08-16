import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-3 p-3">
      <h1 className="text-5xl font-bold">INVENTORY MANAGEMENT THESIS</h1>
      <Link className="px-1 rounded-lg border" href="/login">Login</Link>
      <Link className="px-1 rounded-lg border" href="/register">Register</Link>
      <Link className="px-1 rounded-lg border" href="/dashboard">Dashboard</Link>
    </div>
  );
}

export default Home;