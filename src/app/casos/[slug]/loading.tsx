import { UnacemLoader } from "@/components/UnacemLoader";

export default function CasoLoading(): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <UnacemLoader label="Cargando" />
    </div>
  );
}
