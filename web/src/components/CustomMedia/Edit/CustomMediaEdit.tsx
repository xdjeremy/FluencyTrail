import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  GetAllCustomMediasQuery,
  UpdateCustomMediaMutation,
  UpdateCustomMediaMutationVariables,
} from 'types/graphql';

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms';
import { useMutation } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog';
import { DropdownMenuItem } from 'src/components/ui/dropdown-menu';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import {
  CustomMediaSchema,
  CustomMediaSchemaType,
} from '../Create/CustomMediaSchema';

const UPDATE_CUSTOM_MEDIA = gql`
  mutation UpdateCustomMediaMutation(
    $id: String!
    $input: UpdateCustomMediaInput!
  ) {
    updateCustomMedia(id: $id, input: $input) {
      id
    }
  }
`;

interface CustomMediaEditProps {
  media: GetAllCustomMediasQuery['customMedia'][number];
}

const CustomMediaEdit = ({ media }: CustomMediaEditProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CustomMediaSchemaType>({
    resolver: zodResolver(CustomMediaSchema),
    defaultValues: {
      title: '',
    },
  });

  // fetch the current title

  const [mutate, { loading }] = useMutation<
    UpdateCustomMediaMutation,
    UpdateCustomMediaMutationVariables
  >(UPDATE_CUSTOM_MEDIA, {
    refetchQueries: ['GetAllCustomMediasQuery'],
    onCompleted: () => {
      toast.success('Custom media updated successfully');
      setIsOpen(false);
    },
    onError: error => {
      toast.error(`Error updating custom media: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<CustomMediaSchemaType> = async ({ title }) => {
    mutate({
      variables: {
        id: media.id,
        input: {
          title,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>
        <DropdownMenuItem
          onSelect={e => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Custom Media</DialogTitle>
          <DialogDescription>
            Update the title of your custom language learning media. Click save
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form formMethods={form} onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormDescription>
                  The title of your custom media entry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMediaEdit;
