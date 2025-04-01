import EditActivityCell from 'src/components/Activity/EditActivityCell';

type ActivityPageProps = {
  id: string;
};

const EditActivityPage = ({ id }: ActivityPageProps) => {
  return <EditActivityCell id={id} />;
};

export default EditActivityPage;
