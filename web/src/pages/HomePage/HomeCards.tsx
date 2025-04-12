import HeatMapCell from 'src/components/Home/HeatMapCell';
import { useHomeContext } from 'src/components/Home/HomeProvider';
import ImmersionTrackerCell from 'src/components/Home/ImmersionTrackerCell';
import StreakCell from 'src/components/Home/StreakCell';
import TotalTimeCell from 'src/components/Home/TotalTimeCell';

const HomeCards = () => {
  const { selectedLanguage } = useHomeContext();

  return (
    <>
      {/* Activity Heatmap - Central element */}
      <section>
        <HeatMapCell />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <StreakCell />
        <TotalTimeCell />
      </div>

      <section className="rounded-lg border bg-white p-6 dark:bg-neutral-950">
        <ImmersionTrackerCell languageId={selectedLanguage} />
      </section>
    </>
  );
};

export default HomeCards;
