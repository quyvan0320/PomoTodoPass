import Button from "@/components/ui/Button";

const LandingScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-8 text-white px-4">
      <div className="text-center space-y-2 ">
        <h1 className="text-4xl font-black tracking-[0.15rem] text-[#c89b3c] uppercase">
          PomoTodoPass
        </h1>
        <p className="text-white/40 text-sm max-w-xs mx-auto">
          Biến công việc thành trận chiến. Kiếm điểm, xây streak, đổi giờ giải
          trí.
        </p>
      </div>
      <Button>
         Đăng nhập bằng Google
      </Button>
    </div>
  );
};

export default LandingScreen;
