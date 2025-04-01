import ActivityCell from 'src/components/Activity/ActivityCell';

type ActivityPageProps = {
  id: string;
};

const ActivityPage = ({ id }: ActivityPageProps) => {
  return <ActivityCell id={id} />;
};

export default ActivityPage;
