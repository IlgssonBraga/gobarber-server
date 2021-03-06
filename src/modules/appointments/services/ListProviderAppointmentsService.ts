import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        month,
        day,
        year,
    }: IRequest): Promise<Appointment[]> {
        const cacheKey = `provider-appointmens:${provider_id}:${year}-${month}-${day}`;
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cacheKey,
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider(
                {
                    day,
                    month,
                    year,
                    provider_id,
                },
            );

            console.log('buscou do banco');
            await this.cacheProvider.save(cacheKey, classToClass(appointments));
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;
