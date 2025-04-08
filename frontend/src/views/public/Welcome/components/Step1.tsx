import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import Button from '@/components/ui/Button'
import type { CallbackSetSkip } from '../types'
import { Link } from 'react-router-dom'

type Step1Props = CallbackSetSkip

const Step1 = ({ onNext, onSkip }: Step1Props) => {
    return (
        <div className="text-center">
            <DoubleSidedImage
                className="mx-auto mb-8"
                src="/img/others/welcome.png"
                darkModeSrc="/img/others/welcome-dark.png"
                alt="Welcome"
            />
            <h3 className="mb-2">
                Welcome on Board, lets get started with Elstar
            </h3>
            <p className="text-base">
                Telling us a bit about yourself to get the best experience, this
                will only take a minute or two.
            </p>
            <div className="mt-8 max-w-[350px] mx-auto">
                <Link to={"/admin/home"}>
                    <Button block className="mb-2 bg-indigo-500" variant="solid" onClick={onNext}>
                        Login
                    </Button>
                </Link>
                <Button block className="mb-2 bg-indigo-500" variant="solid" onClick={onNext}>
                    Get started
                </Button>
                <Button block variant="plain" onClick={onSkip}>
                    Skip now
                </Button>
            </div>
        </div>
    )
}

export default Step1
