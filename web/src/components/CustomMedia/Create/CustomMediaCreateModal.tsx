import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Loader2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { CreateCustomMedia, CreateCustomMediaVariables } from 'types/graphql';

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
} from 'src/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/ui/form';
import { Input } from 'src/components/ui/input';

import { CustomMediaSchema, CustomMediaSchemaType } from './CustomMediaSchema';

const CREATE_CUSTOM_MEDIA_MUTATION = gql`
  mutation CreateCustomMedia($input: CreateCustomMediaInput!) {
    createCustomMedia(input: $input) {
      id
      title
      createdAt
    }
  }
`;

const CustomMediaCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [create, { loading, error }] = useMutation<
    CreateCustomMedia,
    CreateCustomMediaVariables
  >(CREATE_CUSTOM_MEDIA_MUTATION, {
    onCompleted: () => {
      toast.success('Custom Media successfully created!');
      setIsOpen(false);
    },
    refetchQueries: ['GetAllCustomMediasQuery'],
  });

  const form = useForm<CustomMediaSchemaType>({
    resolver: zodResolver(CustomMediaSchema),
    defaultValues: {
      title: '',
    },
  });

  const sumbitHandler: SubmitHandler<CustomMediaSchemaType> = ({ title }) => {
    create({
      variables: {
        input: {
          title,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>
        <Button
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white dark:text-neutral-900"
          data-create-button="true"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Media</DialogTitle>
          <DialogDescription>
            Add a title for your custom language learning media. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form formMethods={form} onSubmit={sumbitHandler} className="space-y-6">
          <FormErrorMessage error={error} />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder="Enter media title"
                  />
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Media
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMediaCreateModal;
