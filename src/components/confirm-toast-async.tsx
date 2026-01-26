import toast from "react-hot-toast";

export const confirmToastAsync = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="bg-primary-soft flex flex-col gap-3">
          <p className="font-poppins text-md text-text-primary">{message}</p>

          <div className="flex items-center gap-2">
            <button
              className="bg-primary border border-primary hover:bg-primary-hover hover:cursor-pointer text-white font-semibold px-4 py-2 rounded-lg"
              onClick={() => {
                resolve(true);
                toast.dismiss(t.id);
              }}
            >
              Confirm
            </button>

            <button
              className="bg-white border border-primary hover:bg-primary-soft hover:cursor-pointer text-text-secondary px-4 py-2 rounded-lg font-semibold"
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: { backgroundColor: "#fdf2f8" },
      },
    );
  });
};
