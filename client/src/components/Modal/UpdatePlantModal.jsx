import PropTypes from 'prop-types'
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'

import UpdatePlantForm from '../Form/UpdatePlantForm'
import { imageUpload } from '../../api/utils'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const UpdatePlantModal = ({ setIsEditModalOpen, isOpen, plantId, refetch }) => {
  const axiosSecure = useAxiosSecure()
  const [uploadImage, setUploadImage] = useState({ image: { name: 'Upload Image' } });
  const [loading, setLoading] = useState(false);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true)
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageUrl = await imageUpload(image);

    // Create plant data object
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
    }
    // console.table(plantData);

    // update plant in db

    try {
      // update req
      await axiosSecure.put(`/plants/${plantId}`, plantData)
      refetch()
      toast.success('Data Update Successfully!')
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data)
    } finally {
      setLoading(false)
      setIsEditModalOpen(false)
    }
  }


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsEditModalOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Update Plant Info
                </DialogTitle>
                <div className='mt-2 w-full'>
                  <UpdatePlantForm
                    plantId={plantId}
                    uploadImage={uploadImage}
                    setUploadImage={setUploadImage}
                    loading={loading}
                    handleUpdate={handleUpdate}
                  />
                </div>
                <hr className='mt-8 ' />
                <div className='mt-2 '>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

UpdatePlantModal.propTypes = {
  setIsEditModalOpen: PropTypes.func,
  isOpen: PropTypes.bool,
  plantId: PropTypes.string,
  refetch: PropTypes.func,
}

export default UpdatePlantModal
