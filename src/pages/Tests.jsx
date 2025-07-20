import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h1 className="text-3xl font-bold">Choose Test Type</h1>
      <div className="flex gap-8">
        <button
          onClick={() => navigate("/visualtest")}
          className="bg-blue-500 text-white px-8 py-4 rounded-xl shadow hover:bg-blue-600"
        >
          Visual Test
        </button>
        <button
          onClick={() => navigate("/functionaltest")}
          className="bg-green-500 text-white px-8 py-4 rounded-xl shadow hover:bg-green-600"
        >
          Functional Test
        </button>
      </div>
    </div>
  );
}
